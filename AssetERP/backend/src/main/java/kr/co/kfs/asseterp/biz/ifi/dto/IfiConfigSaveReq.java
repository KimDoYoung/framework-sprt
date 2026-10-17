package kr.co.kfs.asseterp.biz.ifi.dto;

/**
 * I/F 설정 저장 요청 (AS-IS Ifi90_Config.update 가 받는 Ifi90_ConfigModel). configId 0 이하는 신규.
 * 계정PW(localPwDec·targetPwDec)는 받지 않는다 — 원본 UpdateDataModel도 *_pw 컬럼만 쓰고 화면이 고치는 *_pw_dec는 저장하지 않는다
 */
public record IfiConfigSaveReq(
        Long configId,
        String ifCode,
        String ifName,
        String ifType,
        String localHost,
        String localPort,
        String localAccount,
        String localPath,
        String localKey,
        String targetHost,
        String targetPort,
        String targetAccount,
        String targetPath,
        String targetKey,
        String note
) {
}
