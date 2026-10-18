package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr01_class_tree.xml (문서개요복사 + 문서분류 선택 조회창에 쓰는 것만) */
@Mapper
public interface DcrClassTreeMapper {
    /** selectByCompanyId(0) 중 개요가 있는 행의 구분코드·개요 */
    List<ClassTreeNoteRow> selectNotesByCompany(Long companyId);

    /** commentInsert: 회사의 같은 구분코드 문서분류에 개요를 쓴다 */
    int updateNote(ClassTreeNoteRow row);

    /** AS-IS dcr01_class_tree.selectByText (Dcr01_Lookup_SelectMulti, E13-3) */
    List<ClassTreeLookupRes> selectLookup(@Param("companyId") Long companyId, @Param("typeCode") String typeCode, @Param("searchText") String searchText,
                                          @Param("relateTable") String relateTable, @Param("relateId") Long relateId);
}
