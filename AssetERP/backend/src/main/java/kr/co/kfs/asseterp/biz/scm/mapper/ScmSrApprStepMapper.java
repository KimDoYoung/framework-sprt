package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScmSrApprStepMapper {

    /** AS-IS scm02_sr_appr_step.selectBySrId (srId 로) */
    List<SrApprStepRes> selectBySrId(@Param("srId") Long srId);

    /** AS-IS scm02_sr_appr_step.selectBySrId (srApprStepId 로) */
    SrApprStepRes selectByStepId(@Param("srApprStepId") Long srApprStepId);

    /** AS-IS scm02_sr_appr_step.deleteBySrId */
    int deleteBySrId(@Param("srId") Long srId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** 저장(UpdateDataModel 동적 INSERT) */
    int insertStep(@Param("srApprStepId") Long srApprStepId, @Param("srId") Long srId, @Param("req") SrApprStepReq req);

    /** AS-IS Scm01_Edit_Sr.updateApprStep → modelUpdate: 승인·반려. 결재일은 지금, 실결재자는 로그인 사원 */
    int updateDecision(@Param("srApprStepId") Long srApprStepId, @Param("stepStatusCd") String stepStatusCd, @Param("apprEmpId") Long apprEmpId);

    /** AS-IS Scm02_Edit_NoteMessage.update → modelUpdate: 결재의견·반려사유 */
    int updateNote(@Param("srApprStepId") Long srApprStepId, @Param("note") String note, @Param("rejectReason") String rejectReason);
}
