package kr.co.kfs.asseterp.biz.icr.mapper;

import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcrClassTreeMapper {

    /** AS-IS icr01_class_tree.selectByCompanyId (Icr01_Lookup_SelectParent) — 최상위(parent 0)부터 사용 중인 노드를 전위 순서로 */
    List<IcrClassTreeRes> selectTree(@Param("companyId") Long companyId, @Param("typeCode") String typeCode);

    /** AS-IS icr01_class_tree.selectByTypeCodePaging (Icr01_Lookup_SelectMulti) */
    List<IcrClassTreeLookupRes> selectLookup(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                             @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                             @Param("detailSearchYn") boolean detailSearchYn, @Param("limit") long limit, @Param("offset") long offset,
                                             @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS icr01_class_tree.selectByTypeCodePagingTotal */
    long selectLookupTotal(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                           @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                           @Param("detailSearchYn") boolean detailSearchYn,
                           @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS icr01_class_tree.selectById (Icr01_Lookup_ClassTreeDetail) */
    IcrClassTreeDetailRes selectDetail(@Param("classTreeId") Long classTreeId);

    /** AS-IS icr01_class_tree.selectByListIcrId (Icr01_Lookup_SelectMulti "deadline") */
    List<IcrClassTreeDeadlineRes> selectDeadlines(@Param("classTreeIds") List<Long> classTreeIds);
}
