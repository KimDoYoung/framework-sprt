package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.ReprAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act10_repr_account.xml — 대표계정코드 */
@Mapper
public interface ActReprAccountMapper {
    /** AS-IS selectByCompanyId */
    List<ReprAccountRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("attributeCode") String attributeCode,
                                           @Param("searchText") String searchText);

    /** AS-IS selectById */
    ReprAccountRes selectById(@Param("reprAccountId") Long reprAccountId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT — 화면 insertRow()가 회사 ID(로그인 회사)를 넣는다 */
    int insert(@Param("reprAccountId") Long reprAccountId, @Param("companyId") Long companyId, @Param("req") ReprAccountSaveReq req);

    /** UpdateDataModel UPDATE — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") ReprAccountSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteByReprAccountCode */
    int deleteByReprAccountCode(@Param("companyId") Long companyId, @Param("reprAccountCode") String reprAccountCode);

    /** AS-IS insertInitData: 관리자 회사(0)의 그 코드를 대상 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("reprAccountCode") String reprAccountCode);
}
