package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.CorpAccountRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast01_class_tree.xml selectCorpAccount — 계좌선택 조회창(U02) */
@Mapper
public interface AstCorpAccountMapper {
    /** selectCorpAccount — prePayOnlyYn(선급거래처만)·corpId는 없으면 null */
    List<CorpAccountRes> selectCorpAccount(@Param("companyId") Long companyId, @Param("searchText") String searchText, @Param("stdDate") LocalDate stdDate,
                                           @Param("prePayOnlyYn") Boolean prePayOnlyYn, @Param("corpId") Long corpId);
}
