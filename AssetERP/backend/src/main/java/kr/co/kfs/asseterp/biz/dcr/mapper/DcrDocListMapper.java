package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocApprRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileCond;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr00_doc_list.xml (F08 문서별 첨부파일 검색, F09 문서 다운로드) */
@Mapper
public interface DcrDocListMapper {
    /** AS-IS getFile L421 */
    List<DcrDocFileRes> selectFiles(@Param("c") DcrDocFileCond cond);

    /** AS-IS getAppr L493 (조건은 getFile과 같다) */
    List<DcrDocApprRes> selectApprs(@Param("c") DcrDocFileCond cond);
}
