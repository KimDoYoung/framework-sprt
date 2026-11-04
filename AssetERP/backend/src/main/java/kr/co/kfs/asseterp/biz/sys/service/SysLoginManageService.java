package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLoginManageMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys27_LoginManage.java (selectByText L36 / updateConfirmYn L46) — 관리자 화면(고객사 전체) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLoginManageService {

    private static final String APPROVED_MESSAGE = "[Asset-ERP] 신청한 기기의 접속승인이 완료되었습니다.";

    private final SysLoginManageMapper sysLoginManageMapper;
    private final SmsSender smsSender;

    /** AS-IS Sys27_Tab_LoginManage.retrieve() L202-230: 회사·사원 '%' = 전체 */
    public List<LoginManageRes> search(UserPrincipal user, String companyId, String personId) {
        requireSysAdmin(user);
        return sysLoginManageMapper.selectByText(likeOrAll(companyId), likeOrAll(personId));
    }

    /**
     * AS-IS updateConfirmYn L46-70: 승인여부·승인일 저장 → 승인('true')이면 신청자에게 승인 문자(발송 실패는 원본도 로그만 남긴다)
     * → selectById로 다시 읽은 행. 실제 문자는 보내지 않는다(사용자 지시 — DisabledSmsSender가 거절).
     */
    @Transactional
    public LoginManageRes updateConfirmYn(UserPrincipal user, Long loginManageId, Long personId, String confirmYn) {
        requireSysAdmin(user);
        sysLoginManageMapper.updateConfirmYn(loginManageId, confirmYn);
        if ("true".equals(confirmYn)) {
            SysLoginManageMapper.PersonPhone person = sysLoginManageMapper.selectPersonPhone(personId);
            if (person != null && person.mobileTelNo() != null) {
                try {
                    smsSender.send(0L, null, person.mobileTelNo(), APPROVED_MESSAGE, person.korNm());
                } catch (BusinessException e) {
                    log.warn("접속승인 문자를 보내지 못함: personId={}, {}", personId, e.getMessage());
                }
            }
        }
        LoginManageRes res = sysLoginManageMapper.selectById(loginManageId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /**
     * AS-IS Sys27_Lookup_Request.update() L94-126 → sys.Sys27_LoginManage.insert (Sys27_LoginManage.java L81-97):
     * 같은 기기(Mac)로 이미 신청했으면 false("이미 신청완료된 기기입니다"), 아니면 신청 행을 만들고 true.
     * 사원·회사는 요청 값이 아니라 로그인한 사용자다. 브라우저는 Mac 주소를 알 수 없어 macAddress는 비어 있을 수 있다
     */
    @Transactional
    public boolean request(UserPrincipal user, String placeCode, String reason, String macAddress) {
        if (placeCode == null || placeCode.isBlank() || reason == null || reason.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String mac = macAddress == null ? "" : macAddress;
        if (sysLoginManageMapper.countByMacAddress(user.getUserId(), mac) > 0) {
            return false;
        }
        sysLoginManageMapper.insertRequest(user.getCompanyId(), user.getUserId(), mac.isEmpty() ? null : mac, placeCode, reason);
        return true;
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static String likeOrAll(String value) {
        return value == null || value.isEmpty() ? "%" : value;
    }
}
