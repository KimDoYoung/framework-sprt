package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsDcrPreconfirmRes;
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

    /** AS-IS Sys99_Print.insertRdDcrPreConfirm — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId) */
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
