package kr.co.kfs.asseterp.biz.fbx.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxRes;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxSaveReq;
import kr.co.kfs.asseterp.biz.fbx.mapper.FbxBoxMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/fbx/Fbx01_Box.java selectByCompanyId L30, update L59, delete L64 (Fbx01_Tab_Document 위 그리드) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FbxBoxService {

    private final FbxBoxMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** AS-IS selectByCompanyId L30: 로그인 회사, 제목 "%검색어%"(빈 글자면 %%) */
    public List<FbxBoxRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 신규의 조직·생성자는 화면 insertRow()가 넣던 로그인 사용자(LoginUser.getOrgCodeId·getUserId), 상태 기본 01. 제목은 DB가 NOT NULL로 막던 것을 안내로 막는다
     */
    @Transactional
    public List<FbxBoxRes> update(UserPrincipal user, List<FbxBoxSaveReq> rows) {
        List<FbxBoxRes> saved = new ArrayList<>();
        for (FbxBoxSaveReq req : rows) {
            if (req.title() == null || req.title().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "제목은 필수입력 항목입니다");
            }
            FbxBoxSaveReq row = req.crtDate() == null
                    ? new FbxBoxSaveReq(req.boxId(), LocalDateTime.now(), req.title(), req.note(), req.statusCd())
                    : req;
            boolean isNew = row.boxId() == null || row.boxId() <= 0;
            Long id = isNew ? mapper.selectNextId() : row.boxId();
            if (isNew) {
                mapper.insertBox(id, user.getCompanyId(), orgIdOf(user), user.getUserId(), row);
            } else if (mapper.updateBox(user.getCompanyId(), row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS deleteRow() L381-406: 생성자만 지울 수 있다("삭제권한이 없습니다") — 원본은 화면이 첫 행만 검사했다(그리드가 단일 체크라 같은 뜻). 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> boxIds) {
        if (boxIds == null || boxIds.isEmpty()) {
            return 0;
        }
        for (Long crtEmpId : mapper.selectCrtEmpIds(user.getCompanyId(), boxIds)) {
            if (!user.getUserId().equals(crtEmpId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED, "삭제권한이 없습니다");
            }
        }
        return mapper.deleteBoxes(user.getCompanyId(), boxIds);
    }

    /** LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    private Long orgIdOf(UserPrincipal user) {
        return user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }
}
