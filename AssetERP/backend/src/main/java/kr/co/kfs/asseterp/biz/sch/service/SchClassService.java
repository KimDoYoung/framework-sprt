package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassComboRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchClassMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 스케줄분류 (O01) — AS-IS Sch08_Lookup_Class → server/sch/Sch08_Class.java (selectByPersonId L22 / checkClassId L27 / update L36 / delete L41)
 * + 콤보 server/sys/Sys00_Common.selectScheduleClass L171. 분류는 사용자별(sch08_person_id)이라 로그인 사용자의 것만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchClassService {

    private final SchClassMapper mapper;

    /** AS-IS Sch08_Class.selectByPersonId */
    public List<Sch08ClassRes> search(UserPrincipal user) {
        return mapper.selectByPersonId(user.getUserId());
    }

    /** AS-IS sys09_code.selectScheduleClass: 사용 중인 내 분류 콤보 */
    public List<Sch08ClassComboRes> combo(UserPrincipal user) {
        return mapper.selectCombo(user.getUserId());
    }

    /** AS-IS sys09_code.selectScheduleClass2: 내 분류 + 공모주('0') — 기간별 업무일정 조회(O02) */
    public List<Sch08ClassComboRes> comboWithIpo(UserPrincipal user) {
        return mapper.selectCombo2(user.getUserId());
    }

    /** AS-IS Sch08_Class.checkClassId: 분류를 쓰는 일정이 있으면 "사용중인 분류는 삭제 불가합니다" */
    public void checkDelete(Long classId) {
        if (mapper.countInfoByClassId(classId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 분류는 삭제 불가합니다");
        }
    }

    /** AS-IS Sch08_Class.update(UpdateDataModel): 새 행(≤ 0)은 INSERT, 있는 행은 UPDATE → 저장한 행(요청 순서) */
    @Transactional
    public List<Sch08ClassRes> save(UserPrincipal user, List<Sch08ClassSaveReq> rows) {
        Long personId = user.getUserId();
        List<Sch08ClassRes> saved = new ArrayList<>();
        for (Sch08ClassSaveReq req : rows) {
            Long id = req.classId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertClass(id, personId, req);
            } else if (mapper.updateClass(personId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "분류를 찾을 수 없습니다.");
            }
            saved.add(mapper.selectById(id, personId));
        }
        return saved;
    }

    /** AS-IS Sch08_Class.delete(UpdateDataModel.deleteModel) → 지운 수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> classIds) {
        if (classIds == null || classIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteClasses(user.getUserId(), classIds);
    }
}
