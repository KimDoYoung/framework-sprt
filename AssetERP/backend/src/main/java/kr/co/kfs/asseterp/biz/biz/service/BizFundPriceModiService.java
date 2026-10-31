package kr.co.kfs.asseterp.biz.biz.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiMonthRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiRes;
import kr.co.kfs.asseterp.biz.biz.dto.FundPriceModiSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFundPriceModiMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** AS-IS server/biz/Biz60_FundPriceModi.java (selectByText L26 / modelUpdate L36 / update L49 / delete L54) + Biz61_ModiRptRelateAppr.java (selectByCompanyId L25 / updateApprId L34) — 로그인 회사의 행만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizFundPriceModiService {

    private final BizFundPriceModiMapper mapper;

    /** AS-IS Biz60_Tab_FundPriceModiReport.retrieve L596-610: 변경년월(`yyyy.mm`) · 검색어(운용사/펀드)를 `%…%`로 */
    public List<FundPriceModiRes> search(UserPrincipal user, String yyyymm, String searchText) {
        return mapper.selectByText(user.getCompanyId(), yyyymm, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Biz60_Edit_FundPriceModi 생성자 L136-153의 `getSeq` — 편집창이 첨부파일을 올리려고 저장 전에 먼저 받는 번호 */
    public long newId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS Biz60_FundPriceModi.modelUpdate + 편집창 validateFields L721-801(구분·변경일·산출일·운용사·펀드 필수).
     * 번호가 아직 없는 행이면 INSERT, 있으면 UPDATE 하고 다시 읽어 돌려준다. 등록(변경)자·일시는 로그인 사용자 이름·지금(UpdateDataModel 자동 채움)
     */
    @Transactional
    public FundPriceModiRes save(UserPrincipal user, FundPriceModiSaveReq req) {
        if (req.reportType() == null || req.reportType().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "구분을 선택해주세요.");
        }
        if (req.modiDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준가 변경일을 입력해주세요.");
        }
        if (req.priceStdDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준가 산출일을 입력해주세요.");
        }
        if (req.amCorpName() == null || req.amCorpName().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "운용사를 입력해주세요.");
        }
        if (req.fundName() == null || req.fundName().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드를 입력해주세요.");
        }
        if (req.fundPriceModiId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준가 정정 번호가 없습니다.");
        }
        Long companyId = user.getCompanyId();
        if (mapper.countById(companyId, req.fundPriceModiId()) == 0) {
            mapper.insert(companyId, user.getName(), req);
        } else {
            mapper.update(companyId, user.getName(), req);
        }
        return mapper.selectById(companyId, req.fundPriceModiId());
    }

    /** AS-IS Biz60_FundPriceModi.delete — 체크한 행을 확인 뒤 바로 지운다(결재 중·완료 문서도 막지 않는 것이 원본 그대로) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.delete(user.getCompanyId(), ids);
    }

    /**
     * AS-IS Biz60_Tab_FundPriceModiReport.updateApprId L413-430 — 개별 상신(A75·A76) 뒤 결재문서 ID 기록.
     * 문서의 첨부 자동등록 `copyFileLine`(Apr01_Edit_ApprDoc L2881-2883 → Sys10_File.copyFile)도 같이 한다 —
     * AS-IS는 문서를 저장할 때 보고의 첨부파일을 결재문서에 연결하고, TOBE는 문서 ID가 정해지는 이 때 한다(이미 연결된 파일은 다시 넣지 않는다)
     */
    @Transactional
    public int updateApprId(UserPrincipal user, Long fundPriceModiId, Long apprId) {
        if (fundPriceModiId == null || apprId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재문서 정보가 없습니다.");
        }
        int n = mapper.updateApprId(user.getCompanyId(), fundPriceModiId, apprId);
        if (n == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        for (Long fileId : mapper.selectFileIds(fundPriceModiId)) {
            if (mapper.countApprRelateFile(fileId, apprId) == 0) {
                mapper.insertApprRelateFile(mapper.selectNextId(), fileId, apprId);
            }
        }
        return n;
    }

    /** AS-IS Biz61_ModiRptRelateAppr.selectByCompanyId — 변경년월의 월 통합 상신(없으면 null) */
    public FundPriceModiMonthRes month(UserPrincipal user, String yyyymm) {
        List<FundPriceModiMonthRes> list = mapper.selectMonth(user.getCompanyId(), yyyymm);
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS Biz61_ModiRptRelateAppr.updateApprId L34-47 — 있으면 결재문서 ID 갱신, 없으면 새 행 */
    @Transactional
    public void saveMonth(UserPrincipal user, String yyyymm, Long apprId) {
        if (yyyymm == null || yyyymm.isBlank() || apprId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재문서 정보가 없습니다.");
        }
        if (mapper.selectMonth(user.getCompanyId(), yyyymm).isEmpty()) {
            mapper.insertMonth(user.getCompanyId(), yyyymm, apprId);
        } else {
            mapper.updateMonthApprId(user.getCompanyId(), yyyymm, apprId);
        }
    }
}
