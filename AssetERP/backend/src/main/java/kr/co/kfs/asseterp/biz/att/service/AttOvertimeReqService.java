package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqRes;
import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqRow;
import kr.co.kfs.asseterp.biz.att.dto.AttOvertimeReqUpdateReq;
import kr.co.kfs.asseterp.biz.att.mapper.AttOvertimeReqMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Att03_Tab_OvertimeReq(T07) → server/att/Att03_OvertimeReq.java(getConfirmList L65) · Att13_OvertimeReqHist.java(updateInfo L27).
 * 쓰기는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttOvertimeReqService {

    private final AttOvertimeReqMapper mapper;

    /** AS-IS getConfirmList: 승인(결재 상태 30)된 연장근무. 조회기간은 원본 SQL이 쓰지 않는다 */
    public List<AttOvertimeReqRes> getConfirmList(UserPrincipal user) {
        return mapper.getConfirmList(user.getCompanyId());
    }

    /** AS-IS updateInfo: 행마다 이력이 없으면 insert, 있으면 updateInfo → 처리 건수 */
    @Transactional
    public int updateInfo(UserPrincipal user, AttOvertimeReqUpdateReq req) {
        List<AttOvertimeReqRow> rows = req.rows() == null ? List.of() : req.rows();
        for (AttOvertimeReqRow row : rows) {
            if (mapper.countInCompany(user.getCompanyId(), row.overtimeReqId()) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            String confirmYn = req.confirmYn() == null ? row.confirmYn() : String.valueOf(req.confirmYn());
            if (mapper.selectByOvertimeReqId(row.overtimeReqId()).isEmpty()) {
                mapper.insert(row.overtimeReqId(), row.paymentTypeCode(), confirmYn, user.getUserId(), row.changeReason());
            } else {
                mapper.updateInfo(row.overtimeReqId(), row.paymentTypeCode(), confirmYn, user.getUserId(), row.changeReason());
            }
        }
        return rows.size();
    }
}
