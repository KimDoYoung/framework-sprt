package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.DutyProgressRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmDutyProgressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 책무진행 상태 (AS-IS Tdm50_Tab_DutyProgressAdmin → server/sys/Sys99_Print.insertReconTdm·selectByWindowClassName) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmDutyProgressService {

    /** AS-IS 화면이 보내는 windowClassName 고정값 (f_recon_tdm의 점검상태 구분) */
    private static final String WINDOW_CLASS_NAME = "CHCK_STATUS";

    private final TdmDutyProgressMapper mapper;

    /**
     * AS-IS sys99_print.insertReconTdm: f_recon_tdm이 사용자 몫의 sys99_print 행을 지우고 기준월 현황으로 다시 채운다.
     * 회사: KFS 관리자는 고른 회사(0 = 전체), 그 밖에는 로그인 회사. 기준일은 그 달 1일로 맞춘다(AS-IS QuickMoveField.getFirstDay).
     */
    @Transactional
    public void createData(UserPrincipal user, Long companyId, String baseDate) {
        LocalDate firstDay = LocalDate.parse(baseDate).withDayOfMonth(1);
        mapper.insertReconTdm(WINDOW_CLASS_NAME, firstDay.toString(), user.companyOf(companyId), user.getUserId());
    }

    /** AS-IS sys99_print.selectByWindowClassName: 방금 만든 사용자 몫의 행 */
    public List<DutyProgressRes> search(UserPrincipal user) {
        return mapper.selectByWindowClassName(WINDOW_CLASS_NAME, user.getUserId());
    }
}
