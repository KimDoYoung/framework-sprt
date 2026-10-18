package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitRes;
import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitSaveReq;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptFssSubmitMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/rpt/Rpt10_FssSubmit.java (selectBySearchText L23 / modelUpdate L41 / delete L59) — 금감원 업무보고서 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptFssSubmitService {

    private final RptFssSubmitMapper mapper;

    /** AS-IS selectBySearchText: 화면이 "%검색어%"로 감싸 보낸다(없으면 %%) */
    public List<RptFssSubmitRes> search(String searchText) {
        return mapper.selectBySearchText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS modelUpdate: submitId가 없으면 getSeq로 새 ID → INSERT, 있으면 UPDATE → 저장된 행.
     * 원본은 화면·서버 검사가 없어 보고서코드(NOT NULL·5자·UNIQUE) 위반이 DB 오류로 나오므로 미리 막는다(05 §6 DB 오류).
     */
    @Transactional
    public RptFssSubmitRes save(RptFssSubmitSaveReq req) {
        if (req.reportCode() == null || req.reportCode().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고서코드를 입력하세요.");
        }
        if (req.reportCode().length() > 5) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고서코드는 5자 이내로 입력하세요.");
        }
        boolean isNew = req.submitId() == null || req.submitId() <= 0;
        if (mapper.countByReportCode(req.reportCode(), isNew ? null : req.submitId()) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 등록된 보고서코드입니다.");
        }
        Long submitId = req.submitId();
        if (isNew) {
            submitId = mapper.selectNextId();
            mapper.insert(submitId, req);
        } else if (mapper.update(req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(submitId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }
}
