#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/templates"
TMP_ROOT="$REPO_ROOT/tmp/pdfs"
OUTPUT_DIR="$REPO_ROOT/output/pdf"

CHAPTERS="1,2,3,4"
OUTPUT_NAME="zero2Leetcode-蓝皮书-算法面试通关指南"
KEEP_STAGING=0

usage() {
    echo "用法: $0 [--chapters 1,2,3,4] [--output 文件名] [--keep-staging]"
    echo "示例: $0 --chapters 1 --output bluebook-chapter-1-preview"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --chapters)
            CHAPTERS="${2:?--chapters 需要参数}"
            shift 2
            ;;
        --output)
            OUTPUT_NAME="${2:?--output 需要参数}"
            shift 2
            ;;
        --keep-staging)
            KEEP_STAGING=1
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "未知参数: $1" >&2
            usage >&2
            exit 2
            ;;
    esac
done

for command_name in python3 pandoc xelatex pdfinfo; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "缺少依赖: $command_name" >&2
        exit 1
    fi
done

mkdir -p "$TMP_ROOT" "$OUTPUT_DIR"
STAGING_DIR="$(mktemp -d "$TMP_ROOT/bluebook.XXXXXX")"

cleanup() {
    if [[ "$KEEP_STAGING" -eq 1 ]]; then
        echo "暂存目录: $STAGING_DIR"
        return
    fi
    case "$STAGING_DIR" in
        "$TMP_ROOT"/bluebook.*) rm -rf -- "$STAGING_DIR" ;;
        *) echo "拒绝清理非预期目录: $STAGING_DIR" >&2 ;;
    esac
}
trap cleanup EXIT

echo "=== zero2Leetcode 蓝皮书编译 ==="
echo "章节: $CHAPTERS"
echo "输出: $OUTPUT_DIR/$OUTPUT_NAME.pdf"

echo ""
echo "[1/3] 解析 Markdown 来源..."
python3 "$SCRIPT_DIR/prepare.py" \
    --repo-root "$REPO_ROOT" \
    --output-dir "$STAGING_DIR" \
    --chapters "$CHAPTERS"

INPUTS=()
while IFS= read -r input_file; do
    INPUTS+=("$input_file")
done < <(find "$STAGING_DIR" -maxdepth 1 -type f -name '*.md' | sort)

if [[ "${#INPUTS[@]}" -lt 2 ]]; then
    echo "没有找到可编译的章节" >&2
    exit 1
fi

echo ""
echo "[2/3] 校验标题、公式与特殊字符..."
python3 "$SCRIPT_DIR/validate.py" "${INPUTS[@]}"

TEMP_PDF="$STAGING_DIR/$OUTPUT_NAME.pdf"
LOG_FILE="$OUTPUT_DIR/$OUTPUT_NAME.log"

echo ""
echo "[3/3] Pandoc + XeLaTeX 编译（${#INPUTS[@]} 个章节文件）..."
pandoc "${INPUTS[@]}" \
    --from=markdown+raw_html+tex_math_dollars \
    --to=pdf \
    --pdf-engine=xelatex \
    --pdf-engine-opt=-halt-on-error \
    --template="$TEMPLATE_DIR/bluebook.tex" \
    --metadata-file="$TEMPLATE_DIR/metadata.yaml" \
    --resource-path="$REPO_ROOT:$STAGING_DIR:$TEMPLATE_DIR" \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --top-level-division=chapter \
    --no-highlight \
    -o "$TEMP_PDF" 2>&1 | tee "$LOG_FILE"

mv "$TEMP_PDF" "$OUTPUT_DIR/$OUTPUT_NAME.pdf"

echo ""
echo "=== 编译完成 ==="
pdfinfo "$OUTPUT_DIR/$OUTPUT_NAME.pdf" | sed -n '1,18p'
echo "文件大小: $(du -h "$OUTPUT_DIR/$OUTPUT_NAME.pdf" | cut -f1)"
echo "构建日志: $LOG_FILE"
