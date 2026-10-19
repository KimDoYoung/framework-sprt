package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalApprCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/** AS-IS server/apr/mapper/apr90_disposal_list.xml (F04 폐기문서 신청현황, F10 폐기문서 승인) */
@Mapper
public interface AprDisposalListMapper {
    /** AS-IS selectByPersonId L88 */
    List<AprDisposalListRes> selectByPersonId(@Param("c") AprDisposalListCond cond);

    /** AS-IS selectByCompanyId L53 (F10) */
    List<AprDisposalApprRes> selectByCompanyId(@Param("c") AprDisposalApprCond cond);

    /** 선택 행의 문서ID. AS-IS는 클라이언트 모델의 apprId를 쓰지만 서버가 행 ID로 다시 읽는다 */
    Long selectApprId(@Param("companyId") Long companyId, @Param("disposalListId") Long disposalListId);

    /** AS-IS updateDisposalCode L131 */
    int updateDisposalCode(@Param("disposalListId") Long disposalListId, @Param("disposalCode") String disposalCode,
                           @Param("confirmEmpId") Long confirmEmpId, @Param("confirmDate") LocalDateTime confirmDate,
                           @Param("confirmYn") String confirmYn);

    /** AS-IS apr91_disposal_history.insert L24 */
    int insertHistory(@Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId, @Param("regDate") LocalDateTime regDate,
                      @Param("apprId") Long apprId, @Param("disposalCode") String disposalCode);

    /** AS-IS apr01_appr.insertApprDel */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    /** AS-IS opr01_create.updateApprIdByApprId */
    int clearOprCreateAppr(@Param("apprId") Long apprId);

    /** AS-IS pln02_plan.updateApprIdByApprId */
    int clearPlanAppr(@Param("apprId") Long apprId);

    /** AS-IS apr11_advert_book.deleteByApprId */
    int deleteAdvertBook(@Param("apprId") Long apprId);
}
