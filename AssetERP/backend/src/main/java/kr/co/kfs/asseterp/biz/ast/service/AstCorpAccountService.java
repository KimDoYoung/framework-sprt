package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstCorpAccountMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast01_ClassTree.java selectCorpAccount L153 — 계좌선택 조회창 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstCorpAccountService {

    private final AstCorpAccountMapper mapper;

    /** ast01_class_tree.selectCorpAccount — searchText는 앞뒤에 %를 붙이지 않고 SQL이 '%'||검색어||'%'로 쓴다(AS-IS는 "%검색어%"를 주어 %가 겹친다 — 결과는 같다) */
    public List<CorpAccountRes> search(UserPrincipal user, String searchText, LocalDate stdDate, Boolean prePayOnlyYn, Long corpId) {
        return mapper.selectCorpAccount(user.getCompanyId(), "%" + searchText + "%", stdDate, prePayOnlyYn, corpId);
    }
}
