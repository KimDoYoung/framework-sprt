package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprReprCorpMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/apr/Apr15_ReprCorp.java (G08 Apr15_Tab_ReprCorp) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprReprCorpService {

    private final AprReprCorpMapper mapper;

    /** AS-IS Apr15_ReprCorp.selectByCompanyId L23: 로그인 회사의 추가 대표명의 */
    public List<AprReprCorpRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS Apr15_Tab_ReprCorp.updateChk() L171-204 검사(구분 → 대표회사 → 대표자) → Apr15_ReprCorp.update(UpdateDataModel).
     * 새 행(reprCorpId 없음·0 이하)은 새 ID로 INSERT. 저장한 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<AprReprCorpRes> save(UserPrincipal user, List<AprReprCorpSaveReq> rows) {
        for (AprReprCorpSaveReq r : rows) {
            if (isBlank(r.corpType())) throw invalid("구분을 선택하세요");
            if (isBlank(r.corpName())) throw invalid("대표회사를 입력하세요");
            if (isBlank(r.reprName())) throw invalid("대표자를 입력하세요");
        }
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.reprCorpId() == null || r.reprCorpId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.reprCorpId();
            AprReprCorpSaveReq row = new AprReprCorpSaveReq(id, r.corpType(), r.corpName(), r.reprName(),
                    r.corpRegYn(), r.stampId(), r.note(), r.useYn());
            if (isNew) {
                mapper.insertReprCorp(companyId, row);
            } else if (mapper.updateReprCorp(companyId, row) == 0) {
                throw invalid("대표명의를 찾을 수 없습니다");
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /**
     * AS-IS Apr15_ReprCorp.delete L38-52: 삭제 전 사용이력(apr16_stamp_doc) 체크 — 하나라도 있으면 아무것도 지우지 않고 거절
     * → UpdateDataModel.deleteModel. 지운 건수
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            if (mapper.countStampDocByReprCorpId(id) != 0) {
                AprReprCorpRes row = mapper.selectById(companyId, id);
                throw invalid("\"" + (row == null ? "" : row.corpName()) + "\"는 사용이력이 존재하는 대표명의입니다. 삭제할 수 없습니다.");
            }
        }
        return ids.stream().mapToInt(id -> mapper.deleteReprCorp(companyId, id)).sum();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
