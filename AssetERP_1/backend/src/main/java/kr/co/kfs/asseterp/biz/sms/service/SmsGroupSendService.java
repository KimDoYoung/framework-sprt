package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendRes;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendSaveReq;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendTargetReq;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsGroupSendMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sms/Sms03_GroupSend.java (selectByCompanyId L31 / sendGroupMessage L97 / update L162 / delete L167) — 관리자 메뉴라 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsGroupSendService {

    /** AS-IS Sms03_Edit_GroupSend.update L113-144: 고객사(회사 ID ≥ 2)는 내용 90자 이하 */
    private static final int CONTENT_MAX = 90;

    private final SmsGroupSendMapper mapper;
    private final SmsSender smsSender;

    /** AS-IS selectByCompanyId */
    public List<GroupSendRes> search(UserPrincipal user) {
        requireSysAdmin(user);
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Sms03_Tab_SendAdmin.insertRow() L150-157: 회사·생성자 = 로그인, 생성일자 = 오늘 */
    public GroupSendRes newRow(UserPrincipal user) {
        requireSysAdmin(user);
        return new GroupSendRes(null, user.getCompanyId(), user.getUserId(), mapper.selectToday(), null, null, null);
    }

    /** AS-IS update(UpdateDataModel) + 화면 update() 검사(제목·내용 필수, 90자) → 저장된 행 */
    @Transactional
    public GroupSendRes update(UserPrincipal user, GroupSendSaveReq req) {
        requireSysAdmin(user);
        if (req.title() == null || req.title().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다.");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용은 필수입력 항목입니다.");
        }
        if (user.getCompanyId() >= 2L && req.content().length() > CONTENT_MAX) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용은 90자이하로 작성하셔야합니다.");
        }
        boolean isNew = req.groupSendId() == null || req.groupSendId() <= 0;
        Long id = isNew ? mapper.selectNextId() : req.groupSendId();
        if (isNew) {
            mapper.insertGroupSend(id, user.getCompanyId(), user.getUserId(), req);
        } else if (mapper.updateGroupSend(user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(id, user.getCompanyId());
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 (회사 조건 추가) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteGroupSends(user.getCompanyId(), ids);
    }

    /**
     * AS-IS sendGroupMessage L97-127: 단체문자를 읽어 대상마다 "[Asset-ERP] " + 내용을 보낸다(수신자 이름 = 고객사 + " " + 사원명).
     * 실제 발송은 {@link SmsSender}가 하고, 기본 구현은 보내지 않는다(사용자 지시). 대상이 없으면 아무것도 하지 않는다(AS-IS 같음).
     * (AS-IS의 EUC-KR 바이트 변환은 같은 문자열로 되돌아오는 동작이라 옮기지 않는다)
     */
    public void sendGroupMessage(UserPrincipal user, Long groupSendId, List<GroupSendTargetReq> targets) {
        requireSysAdmin(user);
        GroupSendRes groupSend = mapper.selectById(groupSendId, user.getCompanyId());
        if (groupSend == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (targets == null) {
            return;
        }
        for (GroupSendTargetReq target : targets) {
            String targetName = target.companyName() + " " + target.korName();
            smsSender.send(user.getCompanyId(), groupSendId, target.mobileTelNo(), "[Asset-ERP] " + groupSend.content(), targetName);
        }
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
