export function exclusionReason(note) {
  const title = note.title || '';
  if (/财经|华财|花菜|财务|会计|内审|审计/.test(title)) return '财经/财务/会计/审计，不属于技术岗手撕范围';
  if (/(?:岗位|方向|面试|应聘)[：:，\s]*(?:华为)?(?:财经|财务|会计|审计)/.test(note.text || '')) return '财经岗位正文，不属于技术岗手撕范围';
  return '';
}
