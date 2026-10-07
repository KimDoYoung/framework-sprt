package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr01_class_tree.xml (문서개요복사에 쓰는 것만) */
@Mapper
public interface DcrClassTreeMapper {
    /** selectByCompanyId(0) 중 개요가 있는 행의 구분코드·개요 */
    List<ClassTreeNoteRow> selectNotesByCompany(Long companyId);

    /** commentInsert: 회사의 같은 구분코드 문서분류에 개요를 쓴다 */
    int updateNote(ClassTreeNoteRow row);
}
