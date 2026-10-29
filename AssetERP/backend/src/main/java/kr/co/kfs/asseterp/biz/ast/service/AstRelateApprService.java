package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstRelateApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast80_RelateAppr.java (selectByCompanyId L26 · insert L58 · updateApprId L95) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstRelateApprService {

    private final AstRelateApprMapper mapper;

    /** ast80_relate_appr.selectByCompanyId — 한 건이 아니면 호출자는 미상신으로 본다(여러 건이면 첫 건이 아니라 null) */
    public RelateApprRes get(UserPrincipal user, LocalDate date, String linkCode) {
        List<RelateApprRes> list = mapper.selectByCompanyId(user.getCompanyId(), date, linkCode);
        return list.size() == 1 ? list.get(0) : null;
    }

    /** ast80_relate_appr.insert — 이미 있으면 지우고(deleteByApprId) 새 ID로 다시 넣는다. 돌려주는 값 = 새 relateApprId */
    @Transactional
    public long create(UserPrincipal user, LocalDate date, String linkCode) {
        List<RelateApprRes> exist = mapper.selectByCompanyId(user.getCompanyId(), date, linkCode);
        if (!exist.isEmpty()) mapper.deleteByApprId(exist.get(0).relateApprId());
        long id = mapper.selectNextId();
        mapper.insert(id, user.getCompanyId(), date, linkCode);
        return id;
    }

    /** ast80_relate_appr.updateApprId */
    @Transactional
    public int updateApprId(Long relateApprId, Long apprId) {
        return mapper.updateApprId(relateApprId, apprId);
    }
}
