package kr.co.kfs.asseterp.common.error;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        this(errorCode, errorCode.getMessage());
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    /** catch 안에서 던질 때 원인 예외를 남긴다(응답 메시지는 같고, 로그에 원인 스택이 찍힌다) */
    public BusinessException(ErrorCode errorCode, Throwable cause) {
        this(errorCode, errorCode.getMessage(), cause);
    }

    public BusinessException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /** invalid(msg)·fail(msg) 같은 헬퍼로 만든 예외에 원인을 붙인다: {@code throw invalid("…").causedBy(e);} */
    public BusinessException causedBy(Throwable cause) {
        initCause(cause);
        return this;
    }
}
