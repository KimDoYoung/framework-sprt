package kr.co.kfs.asseterp.biz.icam.reader;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * asseterp.icam.mode=real — 운영에서 Tibero(운용/자문 서버)를 읽을 자리. 아직 연결 없음(Tibero JDBC는 상용 드라이버라 운영 전환 때 추가).
 * 연결할 때 SELECT 별칭을 IcamRow 열 이름으로 그대로 돌려주면 액션은 바뀌지 않는다.
 */
@Component
@ConditionalOnProperty(name = "asseterp.icam.mode", havingValue = "real")
public class RealIcamReader implements IcamReader {

    @Override
    public List<IcamRow> read(IcamServer server, String queryId, Map<String, Object> params) {
        throw new BusinessException(ErrorCode.INVALID_INPUT,
                "ICAM 운영 연동(Tibero)이 아직 구현되지 않았습니다: " + server + " " + queryId);
    }
}
