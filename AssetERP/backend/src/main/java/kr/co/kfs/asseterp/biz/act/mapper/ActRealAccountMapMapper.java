package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapRes;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act13_real_account_map.xml — 실계정맵핑 */
@Mapper
public interface ActRealAccountMapMapper {
    /** AS-IS selectByCompanyId */
    List<RealAccountMapRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS selectById */
    RealAccountMapRes selectById(@Param("realAccountMapId") Long realAccountMapId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT — 화면 insertRow()가 회사 ID(로그인 회사)를 넣는다 */
    int insert(@Param("realAccountMapId") Long realAccountMapId, @Param("companyId") Long companyId, @Param("req") RealAccountMapSaveReq req);

    /** UpdateDataModel UPDATE — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") RealAccountMapSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteByAccountMap */
    int deleteByAccountMap(@Param("companyId") Long companyId, @Param("reprAccountCode") String reprAccountCode, @Param("accountMap") String accountMap);

    /** AS-IS insertInitData: 관리자 회사(0)의 그 (대표계정, 맵핑ID)를 대상 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("reprAccountCode") String reprAccountCode, @Param("accountMap") String accountMap);

    /** AS-IS act13_real_account_map.getAccountName (LIMIT 1) — U06 여비교통비 계정과목 */
    String selectAccountName(@Param("companyId") Long companyId, @Param("reprAccountCode") String reprAccountCode, @Param("accountMap") String accountMap);
}
