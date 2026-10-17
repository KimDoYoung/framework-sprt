package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileAdminRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsFormFileAdminMapper {

    /** AS-IS sys10_file.getIcsFile (parentId 0, lawType, searchText) */
    List<IcsFormFileAdminRes> selectIcsFile(@Param("lawType") String lawType, @Param("searchText") String searchText);

    /** 저장·업로드 결과 한 행 */
    IcsFormFileAdminRes selectById(@Param("fileId") Long fileId);

    /** AS-IS sys10_file.update (Ics01_Tab_IcsFileUpload.update) — 내용만 바꾸고 등록일은 지금으로 */
    int updateNote(@Param("fileId") Long fileId, @Param("note") String note);

    /** AS-IS FileUpload.uploadIcs01: 올린 파일 행에 법령구분·관리자등록·내용을 채운다 */
    int updateUploadMeta(@Param("fileId") Long fileId, @Param("lawType") String lawType, @Param("note") String note);
}
