package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsRelateFileMapper {

    /** AS-IS sys11_relate_file.selectByParentId */
    List<IcsRelateFileRes> selectByParentId(@Param("parentId") Long parentId);

    /** AS-IS sys10_file.getIcsFile (parentId 0, lawType null, firstRegDateYn true) */
    List<IcsFormFileRes> selectIcsFormFiles(@Param("searchText") String searchText);

    /** AS-IS sys11_relate_file.insertCheck — 같은 파일·부모가 이미 연결됐는지 */
    int countRelate(@Param("fileId") Long fileId, @Param("parentId") Long parentId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS sys11_relate_file.insert */
    int insertRelate(@Param("relateFileId") Long relateFileId, @Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("parentTable") String parentTable);

    /** AS-IS Sys11_RelateFile.delete(deleteModel) — 한 법규의 연결만 지운다 */
    int deleteRelate(@Param("relateFileId") Long relateFileId, @Param("parentId") Long parentId);
}
