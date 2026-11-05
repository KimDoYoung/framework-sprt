package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmStatusReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmPrintReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeOption;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrTypeSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsDcrPreconfirmMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Ics40_Tab_DcrPreConfirm·Ics40_Tab_DcrReviewConfirm·Ics41_Lookup_DcrType·Ics40_Edit_Msg
 * → server/ics/Ics40_DcrPreconfirm.java (selectByCompanyId L29 / selectByConfirm L64 / selectByReviewConfirm L78 / updateByStatus L94 / modelUpdate L132)
 *   · server/ics/Ics41_DcrType.java (selectByText L24 / adYnCheck L36 / update L59 / delete L64) · server/sys/Sys99_Print.insertRdDcrPreConfirm L5224
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsDcrPreconfirmService {

    /** AS-IS Sys99_Print.insertRdDcrPreConfirm의 windowClassName (화면이 "Ics40"을 넘긴다) */
    private static final String PRINT_WINDOW = "Ics40";

    private final IcsDcrPreconfirmMapper mapper;

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    private static String codeOrAll(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }

    /** AS-IS selectByConfirm — 로그인 회사 */
    public List<IcsDcrPreconfirmRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String dcrTypeCode, String searchText) {
        return mapper.selectByConfirm(user.getCompanyId(), startDate, closeDate, codeOrAll(dcrTypeCode), like(searchText));
    }

    /** AS-IS selectByDate(statusCode "20") — 과거심사필번호 조회창(Ics40_Lookup_SelectSingle): 승인된 사전확인만 */
    public List<IcsDcrPreconfirmRes> searchApproved(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByDate(user.getCompanyId(), startDate, closeDate, like(searchText), "20");
    }

    /** AS-IS selectByReviewConfirm — 로그인 회사 */
    public List<IcsDcrPreconfirmRes> searchReview(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String dcrTypeCode, String searchText) {
        return mapper.selectByReviewConfirm(user.getCompanyId(), startDate, closeDate, codeOrAll(dcrTypeCode), like(searchText));
    }

    /** AS-IS LoginUser.getCompanyModel().getDcrPreconfirmSkipYn() — 승인자·승인일·승인여부 열을 숨기는 회사 설정 */
    public boolean skipYn(UserPrincipal user) {
        return Boolean.TRUE.equals(mapper.selectSkipYn(user.getCompanyId()));
    }

    /** AS-IS updateByStatus — 20 승인(심사필번호 부여) / 그 밖 취소(과거 심사필번호로 쓰인 번호는 취소 불가). 하나라도 막히면 전부 되돌린다 → 처리 건수 */
    @Transactional
    public int updateByStatus(UserPrincipal user, IcsDcrPreconfirmStatusReq req) {
        String year = String.valueOf(LocalDate.now().getYear());
        for (IcsDcrPreconfirmStatusReq.Item item : req.items()) {
            if ("20".equals(req.statusCode())) {
                mapper.updateByStatus01(user.getCompanyId(), item.dcrPreconfirmId(), item.dcrTypeCode(), req.statusCode(), user.getUserId(), year);
            } else {
                if (mapper.countByApprNo(user.getCompanyId(), item.apprNo()) != 0) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 심사필번호는 승인취소할 수 없습니다.");
                }
                mapper.updateByStatus02(user.getCompanyId(), item.dcrPreconfirmId(), req.statusCode());
            }
        }
        return req.items().size();
    }

    /** AS-IS Ics40_Edit_Msg → modelUpdate — 준감인 의견 저장 → 저장된 행 */
    @Transactional
    public IcsDcrPreconfirmRes updateConfirmMsg(UserPrincipal user, Long dcrPreconfirmId, String confirmMsg) {
        if (mapper.updateConfirmMsg(user.getCompanyId(), dcrPreconfirmId, confirmMsg) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), dcrPreconfirmId);
    }

    /** AS-IS ics.Ics40_DcrPreconfirm.selectByApprId — 상신 문서의 사전확인 (부르는 쪽은 한 건일 때만 창을 연다) */
    public List<IcsDcrPreconfirmRes> searchByApprId(UserPrincipal user, Long apprId) {
        return mapper.selectByApprId(user.getCompanyId(), apprId);
    }

    /** AS-IS Ics40_Edit_Msg.editRegEmpMsg → modelUpdate — 신청인 의견 저장 → 저장된 행 */
    @Transactional
    public IcsDcrPreconfirmRes updateRegEmpMsg(UserPrincipal user, Long dcrPreconfirmId, String regEmpMsg) {
        if (mapper.updateRegEmpMsg(user.getCompanyId(), dcrPreconfirmId, regEmpMsg) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), dcrPreconfirmId);
    }

    /**
     * AS-IS Ics40_Edit_DcrPreconfirm.update(applyYn) L333-381 → modelUpdate L132(+ updateByStatus01 L146) — 사전확인 신청창 [신청]·[신청취소]·[저장] → 저장된 행.
     * 회사 설정 dcrPreconfirmSkipYn이면 [신청]이 곧바로 80(PASS)이 되고 심사필번호를 부여한다(신청자가 confirmerId).
     * AS-IS와 다른 점: 원본은 modelUpdate 뒤 화면이 updateByStatus01을 따로 부른다 — TOBE는 한 트랜잭션에서 둘 다 한다.
     */
    @Transactional
    public IcsDcrPreconfirmRes saveDcrPreconfirm(UserPrincipal user, IcsDcrPreconfirmSaveReq req) {
        if (req.dcrTypeCode() == null || req.dcrTypeCode().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "대장분류는 필수선택 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "내용은 필수입력 항목입니다");
        }
        String statusCode = req.statusCode();
        if (req.applyYn() && statusCode != null && skipYn(user)) {
            statusCode = "80";  // PASS
        }
        Long id = req.dcrPreconfirmId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertDcrPreconfirm(id, user.getCompanyId(), user.getUserId(), req.applyYn() ? statusCode : null, req);
        } else if (mapper.updateDcrPreconfirm(user.getCompanyId(), statusCode, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (req.applyYn() && "80".equals(statusCode)) {
            mapper.updateByStatus01(user.getCompanyId(), id, req.dcrTypeCode(), statusCode, user.getUserId(), String.valueOf(LocalDate.now().getYear()));
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS Ics40_Edit_DcrPreconfirm.delete() L399-420 → ics.Ics40_DcrPreconfirm.delete L168 — 로그인 회사 것만 */
    @Transactional
    public int deleteDcrPreconfirm(UserPrincipal user, Long dcrPreconfirmId) {
        int n = mapper.deleteDcrPreconfirm(user.getCompanyId(), dcrPreconfirmId);
        if (n == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return n;
    }

    /** AS-IS Sys99_Print.insertRdDcrPreConfirm — ①내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId) */
    @Transactional
    public String insertRd(UserPrincipal user, IcsDcrPreconfirmPrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();

        mapper.deletePrint(companyId, personId, PRINT_WINDOW);
        for (IcsDcrPreconfirmRes row : mapper.selectByConfirm(companyId, req.startDate(), req.closeDate(), codeOrAll(req.dcrTypeCode()), like(req.searchText()))) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }

    // ── 대장분류 (Ics41_Lookup_DcrType) ──

    /** AS-IS Ics41_DcrType.selectByText(searchText '%', useYn '%') — 조회창이 항상 전체를 부른다 */
    public List<IcsDcrTypeRes> searchDcrTypes(UserPrincipal user) {
        return mapper.selectDcrTypes(user.getCompanyId(), "%", "%");
    }

    /** AS-IS sys.Sys00_Common.selectIcs41DcrType — 사용 중인 대장분류 콤보 */
    public List<IcsDcrTypeOption> dcrTypeOptions(UserPrincipal user) {
        return mapper.selectDcrTypeOptions(user.getCompanyId());
    }

    /** AS-IS Ics41_DcrType.adYnCheck — 없으면(null) "검색되지 않는 대장분류입니다" */
    public IcsDcrTypeRes adYn(UserPrincipal user, String dcrTypeCode) {
        List<IcsDcrTypeRes> list = mapper.selectAdYn(user.getCompanyId(), dcrTypeCode);
        return list.isEmpty() ? null : list.get(0);
    }

    /** AS-IS Ics40_DcrPreconfirm.selectByCompanyId — 사전확인대장에 쓰인 대장분류코드(조회창의 사용 중 검사) */
    public List<String> usedDcrTypeCodes(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId()).stream().map(IcsDcrPreconfirmRes::dcrTypeCode).filter(c -> c != null).distinct().toList();
    }

    /** AS-IS Ics41_DcrType.update(UpdateDataModel) — 요청과 같은 순서의 저장된 행 */
    @Transactional
    public List<IcsDcrTypeRes> saveDcrTypes(UserPrincipal user, List<IcsDcrTypeSaveReq> rows) {
        List<IcsDcrTypeRes> saved = new ArrayList<>();
        for (IcsDcrTypeSaveReq r : rows) {
            long id = (r.dcrTypeId() == null || r.dcrTypeId() <= 0) ? mapper.selectNextId() : r.dcrTypeId();
            IcsDcrTypeSaveReq row = new IcsDcrTypeSaveReq(id, r.dcrTypeCode(), r.dcrTypeName(), r.adYn(), r.useYn());
            if (mapper.updateDcrType(user.getCompanyId(), row) == 0) {
                mapper.insertDcrType(user.getCompanyId(), row);
            }
            saved.add(mapper.selectDcrTypeById(id));
        }
        return saved;
    }

    /** AS-IS Ics41_DcrType.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteDcrTypes(UserPrincipal user, List<Long> dcrTypeIds) {
        return dcrTypeIds.stream().mapToInt(id -> mapper.deleteDcrType(user.getCompanyId(), id)).sum();
    }
}
