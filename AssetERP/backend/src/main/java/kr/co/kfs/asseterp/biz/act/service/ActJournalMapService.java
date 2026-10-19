package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalMapRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalMapSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act12_JournalMap.java (selectByJournalGroup L28, update L34, delete L39) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalMapService {

    private final ActJournalMapMapper mapper;

    /** AS-IS Act11_Grid_TrJournalMap.retrieve() L217-231: 로그인 회사, 분개그룹 */
    public List<JournalMapRes> search(UserPrincipal user, String journalGroup) {
        return mapper.selectByJournalGroup(user.getCompanyId(), journalGroup);
    }

    /**
     * AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 필수 검사(분개그룹·순번·대표계정코드·차대구분)는 화면 preUpdate() L183-209와 같은 문구와 순서
     */
    @Transactional
    public List<JournalMapRes> update(UserPrincipal user, List<JournalMapSaveReq> rows) {
        for (JournalMapSaveReq req : rows) {
            if (isBlank(req.journalGroup())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "분개그룹은 필수입력 항목입니다.");
            }
            if (req.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "순번은 필수입력 항목입니다.");
            }
            if (isBlank(req.reprAccountCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "대표계정코드는 필수입력 항목입니다.");
            }
            if (isBlank(req.drcrType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "차대구분은 필수입력 항목입니다.");
            }
        }
        List<JournalMapRes> saved = new ArrayList<>();
        for (JournalMapSaveReq req : rows) {
            boolean isNew = req.journalMapId() == null || req.journalMapId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.journalMapId();
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

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
