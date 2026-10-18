package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sch/mapper/sch14_ipo_mismatch.xml + UpdateDataModel(sch14_ipo_mismatch) — 공모주일정 미일치내역 */
@Mapper
public interface SchIpoMismatchMapper {
    /** createIpoMismatch: DB 함수 f_create_ipoMismatch() — 'Y'면 성공, 아니면 오류 메시지 */
    String createIpoMismatch();

    List<Sch14IpoMismatchRes> selectByCheckYn(@Param("checkYn") boolean checkYn);

    Sch14IpoMismatchRes selectById(@Param("id") Long id);

    int updateCheckYn(@Param("id") Long id, @Param("checkYn") String checkYn);
}
