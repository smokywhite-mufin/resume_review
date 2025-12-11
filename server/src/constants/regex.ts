// 이름 추출 정규식
export const NAME_REGEX = /(?:이름|성명|Name|name)\s*[:：]\s*(.+?)(?:\n|$)/;

// 전화번호 추출 정규식
export const PHONE_REGEX =
  /(?:전화번호|연락처|휴대폰|휴대전화|Phone|Mobile|phone|mobile|Tel|tel)\s*[:：]\s*(.+?)(?:\n|$)/;
