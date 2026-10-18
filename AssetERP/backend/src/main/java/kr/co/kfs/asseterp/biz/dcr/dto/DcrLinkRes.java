package kr.co.kfs.asseterp.biz.dcr.dto;

/** AS-IS Dcr30_LinkModel (dcr30_link.selectBySearchId) */
public record DcrLinkRes(Long linkId, String linkCode, String linkName, Long companyId, Long classTreeId,
                         String classTreeFullName, Long formMappingId, String gubun, String note) {
}
