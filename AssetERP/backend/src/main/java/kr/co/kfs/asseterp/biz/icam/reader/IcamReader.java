package kr.co.kfs.asseterp.biz.icam.reader;

import java.util.List;
import java.util.Map;

/**
 * 외부 ICAM DB 읽기. AS-IS의 DatabaseFactoryICAM(2).openSession().selectList("쿼리ID", param) 한 줄을 대신한다.
 * 구현체는 asseterp.icam.mode로 고른다: simulator(CSV) / real(Tibero, 운영) / disabled(거절).
 */
public interface IcamReader {

    /**
     * @param queryId AS-IS 매퍼 쿼리 ID (예: icam02_data.selectIcamData)
     * @param params  쿼리 파라미터 (AS-IS HashMap과 같은 키)
     */
    List<IcamRow> read(IcamServer server, String queryId, Map<String, Object> params);
}
