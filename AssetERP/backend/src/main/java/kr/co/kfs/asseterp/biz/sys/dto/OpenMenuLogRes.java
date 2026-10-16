package kr.co.kfs.asseterp.biz.sys.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/** AS-IS Sys96_OpenMenuLogModel (A35 열람 로그 한 행). 로그 ID는 18자리라 문자열로 내보낸다 */
public record OpenMenuLogRes(@JsonSerialize(using = ToStringSerializer.class) Long openMenuLogId, String companyNm, String personInfo,
                             String menuNm, String className, String dateStr, Long second, String loginInfo) {
}
