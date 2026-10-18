package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassDetailSaveReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassDetailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/dcr/Dcr07_ClassDetail.java (selectByClassTreeId L24 / update L34 / delete L39) — 문서분류 세부분류 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrClassDetailService {

    private final DcrClassDetailMapper mapper;

    public List<DcrClassDetailRes> search(Long classTreeId) {
        return mapper.selectByClassTreeId(classTreeId);
    }

    /** AS-IS update(UpdateDataModel): 새 행(임시 ID 0 이하)은 INSERT, 아니면 UPDATE → 저장된 행(요청 순서). 세부분류·조회순서는 화면이 검사하지만 NOT NULL이라 서버도 막는다 */
    @Transactional
    public List<DcrClassDetailRes> save(List<DcrClassDetailSaveReq> rows) {
        List<DcrClassDetailRes> saved = new ArrayList<>();
        for (DcrClassDetailSaveReq req : rows) {
            if (req.classDetailName() == null || req.classDetailName().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "세부분류는 필수입력 항목입니다");
            }
            if (req.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순서는 필수입력 항목입니다");
            }
            boolean isNew = req.classDetailId() == null || req.classDetailId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.classDetailId();
            if (isNew) {
                mapper.insert(id, req);
            } else if (mapper.update(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }
}
