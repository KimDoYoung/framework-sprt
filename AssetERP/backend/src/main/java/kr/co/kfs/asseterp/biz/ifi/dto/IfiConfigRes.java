package kr.co.kfs.asseterp.biz.ifi.dto;

/** I/F 설정 한 행 (AS-IS Ifi90_ConfigModel / ifi90_config). 비밀번호는 복호화한 값(localPwDec·targetPwDec)만 내려보낸다 */
public record IfiConfigRes(
        Long configId,
        String ifCode,
        String ifName,
        String ifType,
        String ifTypeName,
        String localHost,
        String localPort,
        String localAccount,
        String localPwDec,
        String localPath,
        String localKey,
        String targetHost,
        String targetPort,
        String targetAccount,
        String targetPwDec,
        String targetPath,
        /** DB 컬럼은 ifi90_target_key1 (사용자 결정 2026-10-17: 원본의 ifi90_target_key가 이 DB에 없어 key1로 읽고 쓴다) */
        String targetKey,
        String note
) {
}
