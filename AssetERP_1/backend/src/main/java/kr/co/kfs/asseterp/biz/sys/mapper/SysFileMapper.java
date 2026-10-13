package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS sys10_file.xml — 파일 공통(B10) */
@Mapper
public interface SysFileMapper {
    FileRes selectById(@Param("fileId") Long fileId);

    List<FileRes> selectByParentId(@Param("parentId") Long parentId);

    FileRes selectOneByParentId(@Param("parentId") Long parentId);

    int countPersonById(@Param("personId") Long personId);

    Long selectNextId();

    int insertFile(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("fileNm") String fileNm,
                   @Param("serverPath") String serverPath, @Param("size") Double size, @Param("fileExt") String fileExt,
                   @Param("fileYn") String fileYn);

    int deleteById(@Param("fileId") Long fileId);
}
