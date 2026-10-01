package kr.co.kfs.asseterp.oms.biz.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * AS-IS 로그인 이력 (sys26_login). AS-IS 화면(Sys26 로그인 이력)과 호환되도록 같은 상태코드를 쓴다.
 */
@Mapper
public interface LoginHistoryMapper {

    /** 계정 잠김 상태에서 시도 */
    String STATUS_LOCKED = "01";
    /** 비밀번호 틀림 */
    String STATUS_WRONG_PASSWORD = "02";
    /** 사원 로그인 성공 */
    String STATUS_EMPLOYEE_OK = "10";
    /** 회사관리자 로그인 성공 */
    String STATUS_MANAGER_OK = "20";
    /** 비밀번호 만료 (90일) */
    String STATUS_PASSWORD_EXPIRED = "98";
    /** 비밀번호 미설정/초기화 */
    String STATUS_PASSWORD_NOT_SET = "99";
    /** 로그인 방식: P (PC) */
    String LOGIN_MODE_PC = "P";

    int insert(@Param("personId") Long personId,
               @Param("ipAddress") String ipAddress,
               @Param("statusCode") String statusCode,
               @Param("loginMode") String loginMode,
               @Param("browser") String browser);
}
