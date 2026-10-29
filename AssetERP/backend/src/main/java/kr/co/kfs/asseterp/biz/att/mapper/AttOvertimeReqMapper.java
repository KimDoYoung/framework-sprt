package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttOvertimeReqMapper {

    /** AS-IS att03_overtime_req.getConfirmList */
    List<AttOvertimeReqRes> getConfirmList(@Param("companyId") Long companyId);

    /** AS-IS att13_overtime_req_hist.selectByOvertimeReqId — 이력이 있는지만 본다 */
    List<Long> selectByOvertimeReqId(@Param("overtimeReqId") Long overtimeReqId);

    /** AS-IS att13_overtime_req_hist.insert */
    int insert(@Param("overtimeReqId") Long overtimeReqId, @Param("paymentTypeCode") String paymentTypeCode,
               @Param("confirmYn") String confirmYn, @Param("confirmerId") Long confirmerId, @Param("changeReason") String changeReason);

    /** AS-IS att13_overtime_req_hist.updateInfo */
    int updateInfo(@Param("overtimeReqId") Long overtimeReqId, @Param("paymentTypeCode") String paymentTypeCode,
                   @Param("confirmYn") String confirmYn, @Param("confirmerId") Long confirmerId, @Param("changeReason") String changeReason);

    /** 보안 보강: 로그인 회사의 신청인지 */
    int countInCompany(@Param("companyId") Long companyId, @Param("overtimeReqId") Long overtimeReqId);
}
