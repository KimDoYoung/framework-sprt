package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchIpoMismatchMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sch/Sch14_IpoMismatch.java (selectByCheckYn L21 / createIpoMismatch L26 / update L35) — 공모주일정 미일치내역. 쓰기는 관리자 회사만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchIpoMismatchService {

    private final SchIpoMismatchMapper mapper;

    /**
     * AS-IS retrieve() L185-211: 먼저 createIpoMismatch(DB 함수가 미일치내역을 새로 만든다 — 조회가 쓰기)를 부르고,
     * 'Y'가 아니면 그 메시지를 오류로 알린 뒤, selectByCheckYn(미확인 종목만이면 확인완료가 아닌 것만)으로 읽는다
     */
    @Transactional
    public List<Sch14IpoMismatchRes> search(UserPrincipal user, boolean checkYn) {
        requireAdminCompany(user);
        String msg = mapper.createIpoMismatch();
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
        return mapper.selectByCheckYn(checkYn);
    }

    /** AS-IS update(UpdateDataModel): 확인완료를 바꾸고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<Sch14IpoMismatchRes> update(UserPrincipal user, List<Sch14IpoMismatchSaveReq> rows) {
        requireAdminCompany(user);
        List<Sch14IpoMismatchRes> saved = new ArrayList<>();
        for (Sch14IpoMismatchSaveReq req : rows) {
            if (mapper.updateCheckYn(req.ipoMismatchId(), req.checkYn()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(req.ipoMismatchId()));
        }
        return saved;
    }

    private static void requireAdminCompany(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
