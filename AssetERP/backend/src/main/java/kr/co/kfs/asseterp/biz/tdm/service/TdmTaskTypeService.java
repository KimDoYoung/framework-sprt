package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmTaskTypeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 책무유형 (AS-IS server/tdm/Tdm14_TaskType) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmTaskTypeService {

    private final TdmTaskTypeMapper mapper;

    /** AS-IS Tdm14_TaskType.selectByCompanyId: taskClassCode는 책무구분 콤보 값('%'=전체), useYn이면 사용만 */
    public List<TaskTypeRes> search(UserPrincipal user, String taskClassCode, boolean useYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), taskClassCode == null || taskClassCode.isEmpty() ? "%" : taskClassCode, useYn);
    }

    /** AS-IS Tdm14_TaskType.update: 행마다 코드 중복·(코드를 바꿨다면) 변경 전 코드의 책무 연결 검사 뒤 저장. 저장한 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<TaskTypeRes> save(UserPrincipal user, List<TaskTypeRow> rows) {
        Long companyId = user.getCompanyId();
        for (TaskTypeRow row : rows) {
            // Tdm14_Lookup_TaskType.update L318-369 (화면 검사 문구)
            if (row.taskTypeCode() == null || row.taskTypeCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "책무유형코드를 입력하세요");
            }
            if (row.taskTypeCode().length() != 3) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "책무유형코드는 3자리로 입력하세요 (책무구분코드 1 + 순번 2자리)");
            }
            if (row.taskTypeName() == null || row.taskTypeName().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "책무유형명을 입력하세요");
            }
            Long id = row.taskTypeId() == null || row.taskTypeId() <= 0 ? -1L : row.taskTypeId();
            // Tdm14_TaskType.update L31-57
            if (mapper.countDupByTaskTypeCode(companyId, row.taskTypeCode(), id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 코드입니다(" + row.taskTypeCode() + ")");
            }
            String before = id > 0 ? mapper.selectTaskTypeCode(companyId, id) : null;
            if (before != null && !row.taskTypeCode().equals(before)
                    && mapper.countUseByTaskTypeCode(companyId, before) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "변경전 코드가 책무에 연결되어 있는 코드입니다(" + before + ")");
            }
        }
        List<Long> ids = new ArrayList<>();
        for (TaskTypeRow row : rows) {
            if (row.taskTypeId() == null || row.taskTypeId() <= 0) {
                Long newId = mapper.selectNextId();
                mapper.insertTaskType(newId, companyId, row, user.getName());
                ids.add(newId);
            } else {
                if (mapper.updateTaskType(companyId, row, user.getName()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                ids.add(row.taskTypeId());
            }
        }
        return ids.stream().map(id -> mapper.selectById(companyId, id)).toList();
    }

    /** AS-IS Tdm14_TaskType.delete: 책무에 연결된 코드는 삭제 못 한다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> taskTypeIds) {
        if (taskTypeIds == null || taskTypeIds.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        for (Long id : taskTypeIds) {
            String code = mapper.selectTaskTypeCode(companyId, id);
            if (code != null && mapper.countUseByTaskTypeCode(companyId, code) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "책무에 연결되어 있는 코드입니다(" + code + ")");
            }
        }
        return mapper.deleteTaskTypes(taskTypeIds, companyId);
    }
}
