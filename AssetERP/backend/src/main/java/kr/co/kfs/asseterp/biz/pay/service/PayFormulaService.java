package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayFormulaMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/pay/Pay04_Formula.java (selectByCompanyId L27 / selectByDate L39 / insert L58 / basicDataCreate L91 / deleteByDate L139 / update L152 / delete L157).
 * 왼쪽은 로그인 회사, 오른쪽은 고른 고객사(companyId). 다른 회사를 읽는 것은 관리자 회사만, 쓰기는 관리자 회사만(화면도 관리자에게만 쓰기 버튼을 둔다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayFormulaService {

    /** AS-IS insert: 이전 데이터가 없을 때 넣는 임시 항목코드 */
    private static final String TEMP_ITEM_CODE = "110";

    private final PayFormulaMapper mapper;

    // S16: 생성·저장·삭제는 로그인 회사 행만 다루므로 고객사 관리자도 허용(임금계산방법 창 Pay04_Lookup_Formula, 사용자 결정 2026-10-28). 고객사 지정 기초데이터생성만 KFS 관리자
    /** AS-IS selectByCompanyId: 기준 적용일 목록(최신순) */
    public List<PayFormulaDateRes> searchDates(UserPrincipal user, Long companyId) {
        return mapper.selectDates(targetCompany(user, companyId));
    }

    /** AS-IS selectByDate: 적용일의 산출식 행 */
    public List<PayFormulaRes> searchByDate(UserPrincipal user, Long companyId, LocalDate startDate) {
        return mapper.selectByDate(targetCompany(user, companyId), startDate);
    }

    /**
     * AS-IS Pay04_Lookup_Insert → insert: 로그인 회사의 가장 최근 적용일 행을 새 적용일로 복사한다(없으면 임시 항목코드 한 줄).
     * 복사는 산출식·항목코드만 옮기고 비고는 옮기지 않는다(원본 SQL이 비고를 넣지 않음)
     */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        List<PayFormulaRes> latest = mapper.selectByMaxCompanyId(companyId);
        if (latest.isEmpty()) {
            mapper.insert(mapper.selectNextId(), companyId, new PayFormulaSaveReq(null, startDate, TEMP_ITEM_CODE, null, null));
            return;
        }
        for (PayFormulaRes row : latest) {
            mapper.insert(mapper.selectNextId(), companyId, new PayFormulaSaveReq(null, startDate, row.itemCd(), row.formulaForm(), null));
        }
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서) */
    @Transactional
    public List<PayFormulaRes> save(UserPrincipal user, List<PayFormulaSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(req -> {
            boolean exists = req.formulaId() != null && req.formulaId() > 0 && mapper.selectById(req.formulaId()) != null;
            if (exists) {
                if (mapper.update(companyId, req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.formulaId());
            }
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
            if (req.itemCd() == null || req.itemCd().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "급여항목은 필수입력 항목입니다.");
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, companyId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /** AS-IS deleteByDate: 로그인 회사의 해당 적용일을 통째로 지운다 → 지운 건수 */
    @Transactional
    public int deleteDate(UserPrincipal user, LocalDate startDate) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
        return mapper.deleteByDate(user.getCompanyId(), startDate);
    }

    /**
     * AS-IS basicDataCreate: 고객사에 관리자 회사(0)의 해당 적용일 산출식을 복사한다.
     * 고객사에 이미 적용일이 하나라도 있으면 (그 적용일을 먼저 지우고) 복사한다 — 원본 그대로. 복사는 비고를 옮기지 않는다
     */
    @Transactional
    public int basicDataCreate(UserPrincipal user, Long companyId, LocalDate startDate) {
        requireSysAdmin(user);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사는 필수 선택 사항입니다");
        }
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일은 필수 선택 사항입니다");
        }
        boolean hasData = !mapper.selectDates(companyId).isEmpty();
        List<PayFormulaRes> source = mapper.selectByDate(0L, startDate);
        if (hasData) {
            mapper.deleteByDate(companyId, startDate);
        }
        for (PayFormulaRes row : source) {
            mapper.insert(mapper.selectNextId(), companyId, new PayFormulaSaveReq(null, startDate, row.itemCd(), row.formulaForm(), null));
        }
        return source.size();
    }

    /** 대상 회사: 없거나 로그인 회사면 로그인 회사, 다른 회사는 관리자 회사만(클라이언트 값을 그냥 믿지 않는다) */
    private Long targetCompany(UserPrincipal user, Long companyId) {
        if (companyId == null || companyId.equals(user.getCompanyId())) {
            return user.getCompanyId();
        }
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
