package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.FormFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmFormFileMapper {

    /** AS-IS sys10_file.getTdmCheckFormFile — formType은 '%'(전체)·코드, searchText는 LIKE 패턴 */
    List<FormFileRes> selectFormFiles(@Param("companyId") Long companyId, @Param("formType") String formType, @Param("searchText") String searchText);

    /** AS-IS sys.Sys10_File.update(UpdateDataModel) — 구분·비고만, 회사 범위 */
    int updateFormFile(@Param("companyId") Long companyId, @Param("fileId") Long fileId,
                       @Param("formType") String formType, @Param("note") String note);

    /** AS-IS FileUpload.uploadTdmForm — 올린 행에 구분·비고·등록자를 채운다 */
    int updateUploaded(@Param("fileId") Long fileId, @Param("formType") String formType, @Param("note") String note, @Param("personId") Long personId);
}
