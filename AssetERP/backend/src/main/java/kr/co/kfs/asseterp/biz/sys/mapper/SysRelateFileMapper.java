package kr.co.kfs.asseterp.biz.sys.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS sys11_relate_file.xml — 첨부 삭제 판정(B10) */
@Mapper
public interface SysRelateFileMapper {
    int countCheckFileDelete01(@Param("fileId") Long fileId, @Param("parentId") Long parentId);

    int countCheckFileDelete02(@Param("fileId") Long fileId, @Param("parentId") Long parentId);

    int countCheckFileDelete03(@Param("fileId") Long fileId, @Param("parentId") Long parentId);

    int deleteRelateFile(@Param("fileId") Long fileId, @Param("parentId") Long parentId);
}
