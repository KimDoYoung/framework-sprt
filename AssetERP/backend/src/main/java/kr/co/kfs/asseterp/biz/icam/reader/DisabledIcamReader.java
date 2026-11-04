package kr.co.kfs.asseterp.biz.icam.reader;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/** asseterp.icam.mode=disabled(기본) 또는 real(운영 연동 전) — 읽지 않고 알린다 */
@Component
@ConditionalOnProperty(name = "asseterp.icam.mode", havingValue = "disabled", matchIfMissing = true)
public class DisabledIcamReader implements IcamReader {

    @Override
    public List<IcamRow> read(IcamServer server, String queryId, Map<String, Object> params) {
        throw new BusinessException(ErrorCode.INVALID_INPUT,
                "ICAM 읽기가 꺼져 있습니다(asseterp.icam.mode=disabled): " + server + " " + queryId);
    }
}
