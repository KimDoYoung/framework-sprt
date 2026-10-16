package kr.co.kfs.asseterp.common.log;

/**
 * 로그 패턴(logback-spring.xml)과 감사 로그에서 사용하는 MDC 키
 */
public final class MdcKeys {

    public static final String TRACE_ID = "traceId";
    public static final String USER_ID = "userId";
    public static final String CLIENT_IP = "clientIp";
    /** 접속 회사 코드 (서브도메인, sys01_loc_nm) */
    public static final String TENANT = "tenant";

    private MdcKeys() {
    }
}
