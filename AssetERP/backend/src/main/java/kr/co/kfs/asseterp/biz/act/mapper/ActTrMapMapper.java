package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.TrMapRes;
import kr.co.kfs.asseterp.biz.act.dto.TrMapSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act11_tr_map.xml — 거래맵핑 */
@Mapper
public interface ActTrMapMapper {
    /** AS-IS selectByCompanyId */
    List<TrMapRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("trSearchText") String trSearchText,
                                     @Param("jnlGroupSearchText") String jnlGroupSearchText);

    /** AS-IS selectById */
    TrMapRes selectById(@Param("trMapId") Long trMapId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT — 화면 insertRow()가 회사 ID·사용을 넣는다 */
    int insert(@Param("trMapId") Long trMapId, @Param("companyId") Long companyId, @Param("req") TrMapSaveReq req);

    /** UpdateDataModel UPDATE — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") TrMapSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteByJournalGroup */
    int deleteByJournalGroup(@Param("companyId") Long companyId, @Param("trCode") String trCode, @Param("journalGroup") String journalGroup);

    /** AS-IS insertInitData: 관리자 회사(0)의 그 거래코드·분개그룹을 대상 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("trCode") String trCode, @Param("journalGroup") String journalGroup);
}
