package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/** AS-IS server/apr/mapper/apr99_appr_del.xml (EE01 폐기문서 복구) */
@Mapper
public interface AprApprDelMapper {
    /** AS-IS apr99_appr_del.selectByCompanyId L88 */
    List<AprApprDelRes> selectByCompanyId(@Param("c") AprApprDelCond cond);

    /** AS-IS apr99_appr_del.restore L121 — 폐기문서를 상신문서(apr01)로 되돌린다. 이 회사 문서만 */
    int restore(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS apr99_appr_del.deleteApprId — 폐기문서(apr99)에서 지운다 */
    int deleteApprId(@Param("apprId") Long apprId);

    /** AS-IS apr90_disposal_list.deleteByApprId */
    int deleteDisposalListByApprId(@Param("apprId") Long apprId);

    /** AS-IS apr91_disposal_history.insert */
    int insertDisposalHistory(@Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId, @Param("regDate") LocalDateTime regDate,
                              @Param("apprId") Long apprId, @Param("disposalCode") String disposalCode);
}
