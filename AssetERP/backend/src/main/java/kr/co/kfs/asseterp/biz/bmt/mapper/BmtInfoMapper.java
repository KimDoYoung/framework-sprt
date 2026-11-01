package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtInfoSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BmtInfoMapper {

    /** AS-IS bmt10_info.selectByCompanyId — checkYn(폐기건 포함)이 false면 기준일에 폐기되지 않은 건만 */
    List<BmtInfoRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("itemClassCode") String itemClassCode,
                                       @Param("baseDate") LocalDate baseDate, @Param("checkYn") boolean checkYn,
                                       @Param("searchText") String searchText);

    /** AS-IS bmt10_info.selectByBaseDate — 한 행을 기준일 사용자로 다시 읽기(수정·이력 창을 닫은 뒤) */
    BmtInfoRes selectByBaseDate(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS bmt10_info.selectById */
    BmtInfoRes selectById(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bmt10_Info.modelUpdate → UpdateDataModel INSERT */
    int insert(@Param("infoId") long infoId, @Param("companyId") Long companyId, @Param("req") BmtInfoSaveReq req);

    /** AS-IS Bmt10_Info.modelUpdate → UpdateDataModel UPDATE — 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("req") BmtInfoSaveReq req);

    /** AS-IS Bmt10_Info.modelDelete → UpdateDataModel DELETE */
    int delete(@Param("companyId") Long companyId, @Param("infoId") Long infoId);
}
