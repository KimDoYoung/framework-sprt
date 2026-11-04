package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeTargetSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpSmsNoticeTargetMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp93_SmsNoticeTarget.java (selectBySmsNoticeCode L24, update L38, delete L43) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpSmsNoticeTargetService {

    private final EmpSmsNoticeTargetMapper mapper;

    /** AS-IS Emp93_Lookup_SmsNoticeTarget.retrieve() L127-139: 로그인 회사의 그 구분(smsNoticeCode) 수신인 */
    public List<SmsNoticeTargetRes> search(UserPrincipal user, String smsNoticeCd) {
        return mapper.selectBySmsNoticeCode(user.getCompanyId(), smsNoticeCd);
    }

    /** AS-IS Emp93_Lookup_SmsNoticeTarget.update() L141-145: 새 행(ID 0 이하)은 INSERT, 나머지는 비고 UPDATE → 요청과 같은 순서의 저장된 행 */
    @Transactional
    public List<SmsNoticeTargetRes> save(UserPrincipal user, List<SmsNoticeTargetSaveReq> list) {
        List<SmsNoticeTargetRes> saved = new ArrayList<>();
        for (SmsNoticeTargetSaveReq r : list) {
            Long id = r.smsNoticeTargetId();
            if (id == null || id <= 0) {
                if (r.personId() == null || r.smsNoticeCd() == null || r.smsNoticeCd().isEmpty()) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "사원과 알림구분은 필수입력 항목입니다");
                }
                id = mapper.selectNextId();
                mapper.insert(id, user.getCompanyId(), r.personId(), r.smsNoticeCd(), r.note());
            } else if (mapper.updateNote(user.getCompanyId(), id, r.note()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "수신인 정보를 찾을 수 없습니다.");
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /** AS-IS Emp93_Lookup_SmsNoticeTarget.deleteRow() L194-198 → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
