package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.AstDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstDetailSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstDetailMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/ast/Ast02_Detail.java (selectByCompanyId0 L31 / update L52 / delete L57).
 * 자산상세 항목관리는 공통 회사(0) 전용 화면이라 저장·삭제는 관리자 회사만 한다(보안 보강, D11과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstDetailService {

    private final AstDetailMapper mapper;

    /** AS-IS selectByCompanyId0: defaultYn은 화면이 "true"로 고정, 검색어는 "%검색어%". 로그인 회사가 0일 때만 행이 나온다 */
    public List<AstDetailRes> search(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId0("true", user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%", String.valueOf(useYn));
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 조회순번·항목 필수 검사는 화면이 하지만 DB 오류(NOT NULL)를 막으려고 서버도 같은 문구로 막는다
     */
    @Transactional
    public List<AstDetailRes> save(UserPrincipal user, List<AstDetailSaveReq> rows) {
        requireSysAdmin(user);
        for (AstDetailSaveReq req : rows) {
            if (req.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순번은 필수입력 항목입니다.");
            }
            if (req.title() == null || req.title().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "항목은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.detailId() != null && req.detailId() > 0 && mapper.selectById(req.detailId()) != null;
            if (exists) {
                if (mapper.update(user.getCompanyId(), req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.detailId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
