package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileCond;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr00_doc_list.xml (F08 문서별 첨부파일 검색) */
@Mapper
public interface DcrDocListMapper {
    /** AS-IS getFile L421 */
    List<DcrDocFileRes> selectFiles(@Param("c") DcrDocFileCond cond);
}
