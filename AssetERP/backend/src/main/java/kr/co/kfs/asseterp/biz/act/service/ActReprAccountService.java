package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.ReprAccountInitReq;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActReprAccountMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act10_ReprAccount.java (selectByCompanyId L25, insertInitData L31, update L48, delete L53) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActReprAccountService {

    private final ActReprAccountMapper mapper;

    /** AS-IS Act10_Tab_ReprAccount.retrieve() L304-336: 로그인 회사, 속성 없으면 "%", 검색어 "%검색어%"(없으면 "%") */
    public List<ReprAccountRes> search(UserPrincipal user, String attributeCode, String searchText) {
        String attribute = attributeCode == null || attributeCode.isEmpty() ? "%" : attributeCode;
        String search = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return mapper.selectByCompanyId(user.getCompanyId(), attribute, search);
    }

    /**
     * AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 필수 열(코드·이름·속성)은 원본이 DB 제약에 맡겨 오류 메시지가 그대로 나왔다 → 서버가 안내로 막는다(E19와 같은 처리)
     */
    @Transactional
    public List<ReprAccountRes> update(UserPrincipal user, List<ReprAccountSaveReq> rows) {
        List<ReprAccountRes> saved = new ArrayList<>();
        for (ReprAccountSaveReq req : rows) {
            if (isBlank(req.reprAccountCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "대표계정코드는 필수입력 항목입니다");
            }
            if (isBlank(req.reprAccountName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "대표계정명은 필수입력 항목입니다");
            }
            if (isBlank(req.attributeCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "계정속성은 필수선택 항목입니다");
            }
            boolean isNew = req.reprAccountId() == null || req.reprAccountId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.reprAccountId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS insertInitData L31-46: 고른 대표계정코드마다 고른 고객사에서 같은 코드를 지우고 관리자 회사 것을 복사한다 → 처리한 고객사 수.
     * 원본은 고객사마다 서비스를 따로 불러 하나라도 실패하면 일부만 복사됐다 — 여기서는 한 트랜잭션. 관리자 회사만(원본은 버튼 노출만 막았다)
     */
    @Transactional
    public int insertInitData(UserPrincipal user, ReprAccountInitReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<Long> companyIds = req.companyIds() == null ? List.of() : req.companyIds();
        List<String> codes = req.reprAccountCodes() == null ? List.of() : req.reprAccountCodes();
        for (Long companyId : companyIds) {
            for (String code : codes) {
                mapper.deleteByReprAccountCode(companyId, code);
                mapper.insertInitData(companyId, code);
            }
        }
        return companyIds.size();
    }

    private boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
